const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Delete request (soft delete)
exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  const request = await ServiceRequest.findById(id);
  
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  // Check permissions: Only requester or admin can delete
  if (String(request.requester) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this request' });
  }

  // Soft delete by setting isDeleted flag
  request.isDeleted = true;
  request.deletedAt = new Date();
  request.deletedBy = req.user._id;
  await request.save();

  // Create notification for the other party
  const recipient = req.user.role === 'admin' ? request.requester : request.worker;
  if (recipient) {
    await createNotification({
      recipient,
      sender: req.user._id,
      type: 'request_deleted',
      title: 'Request Deleted',
      message: `A service request (${request.title}) has been deleted.`,
      relatedRequest: request._id
    });
  }

  res.json({ message: 'Request deleted successfully' });
};


// create request (user)
exports.createRequest = async (req, res) => {
  const { title, description, address, scheduledAt, price } = req.body;
  const images = (req.files || []).map(f => `/uploads/${f.filename}`);
  const reqDoc = await ServiceRequest.create({
    title, description, address, scheduledAt, price,
    images,
    requester: req.user._id
  });
  res.status(201).json(reqDoc);
};

// list requests — query depends on role
exports.listRequests = async (req, res) => {
  const { page=1, limit=20, status } = req.query;
  const filter = {};
  if(status) filter.status = status;

  // users see their requests; workers see open/assigned to them; admin see all
  if(req.user.role === 'user'){
    filter.requester = req.user._id;
  } else if(req.user.role === 'worker'){
    filter.$or = [{ status: 'open' }, { worker: req.user._id }];
  }
  const docs = await ServiceRequest.find(filter)
    .populate('requester','name phone location')
    .populate('worker','name phone')
    .skip((page-1)*limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({ count: docs.length, requests: docs });
};

// assign worker to request (worker or admin can accept)
exports.assignWorker = async (req, res) => {
  const { id } = req.params; // request id
  const request = await ServiceRequest.findById(id);
  if(!request) return res.status(404).json({ message: 'Request not found' });

  // Only worker (self) or admin can assign
  if(req.user.role === 'worker') {
    request.worker = req.user._id;
    request.status = 'assigned';
    await request.save();
    
    // Notify requester
    await createNotification({
      recipient: request.requester,
      sender: req.user._id,
      type: 'request_assigned',
      title: 'Worker Assigned',
      message: `${req.user.name} has accepted your service request.`,
      relatedRequest: request._id
    });
    
    return res.json(request);
  }

  if(req.user.role === 'admin'){
    const { workerId } = req.body;
    const worker = await User.findById(workerId);
    if(!worker || worker.role !== 'worker') return res.status(400).json({ message: 'Invalid worker' });
    request.worker = worker._id;
    request.status = 'assigned';
    await request.save();
    
    // Notify requester
    await createNotification({
      recipient: request.requester,
      sender: worker._id,
      type: 'request_assigned',
      title: 'Worker Assigned',
      message: `${worker.name} has been assigned to your service request.`,
      relatedRequest: request._id
    });
    
    return res.json(request);
  }

  return res.status(403).json({ message: 'Not allowed' });
};

// update status (worker or user)
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // validate allowed transitions as needed
  const request = await ServiceRequest.findById(id);
  if(!request) return res.status(404).json({ message: 'Request not found' });

  // user can cancel
  if(req.user.role === 'user' && String(request.requester) === String(req.user._id)) {
    if(['cancelled'].includes(status)) {
      request.status = status;
      await request.save();
      
      // Notify worker if assigned
      if (request.worker) {
        await createNotification({
          recipient: request.worker,
          sender: req.user._id,
          type: 'status_update',
          title: 'Request Cancelled',
          message: `The service request "${request.title}" has been cancelled by the requester.`,
          relatedRequest: request._id
        });
      }
      
      return res.json(request);
    }
    return res.status(403).json({ message: 'Users can only cancel' });
  }

  // worker assigned can move to in_progress/completed
  if(req.user.role === 'worker' && String(request.worker) === String(req.user._id)) {
    if(['in_progress','completed'].includes(status)) {
      request.status = status;
      await request.save();
      
      // Notify requester
      const statusMessage = status === 'in_progress' ? 'is now in progress' : 'has been completed';
      await createNotification({
        recipient: request.requester,
        sender: req.user._id,
        type: 'status_update',
        title: `Request ${status === 'completed' ? 'Completed' : 'In Progress'}`,
        message: `Your service request "${request.title}" ${statusMessage}.`,
        relatedRequest: request._id
      });
      
      return res.json(request);
    }
    return res.status(403).json({ message: 'Invalid status' });
  }

  // admin can set any
  if(req.user.role === 'admin') {
    request.status = status;
    await request.save();
    
    // Notify requester
    await createNotification({
      recipient: request.requester,
      type: 'status_update',
      title: 'Request Status Updated',
      message: `Your service request status has been updated to: ${status}`,
      relatedRequest: request._id
    });
    
    return res.json(request);
  }

  res.status(403).json({ message: 'Not allowed' });
};

// Get single request by ID with full details
exports.getRequestById = async (req, res) => {
  const { id } = req.params;
  const request = await ServiceRequest.findById(id)
    .populate('requester', 'name email phone location profileImage')
    .populate('worker', 'name email phone location profileImage skills rating ratingsCount');
  
  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }
  
  // Check permissions
  const isRequester = String(request.requester._id) === String(req.user._id);
  const isWorker = request.worker && String(request.worker._id) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';
  
  if (!isRequester && !isWorker && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to view this request' });
  }
  
  res.json(request);
};
