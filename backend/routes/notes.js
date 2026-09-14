const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

// GET ALL NOTES - Pinned wale upar ayenge
router.get('/', auth, async (req,res)=>{
  const notes = await Note.find({user: req.user}).sort({pinned: -1, createdAt:-1});
  res.json(notes);
});

// CREATE
router.post('/', auth, async (req,res)=>{
  const { title, content, tag } = req.body;
  const note = await Note.create({user: req.user, title, content, tag});
  res.json(note);
});

// UPDATE
router.put('/:id', auth, async (req,res)=>{
  const { title, content, tag } = req.body;
  const note = await Note.findOneAndUpdate(
    {_id: req.params.id, user: req.user},
    {title, content, tag},
    {returnDocument: 'after'}
  );
  res.json(note);
});

// PIN / UNPIN - Fixed
router.patch('/pin/:id', auth, async (req,res)=>{
  const note = await Note.findOne({_id: req.params.id, user: req.user});
  if(!note) return res.status(404).json({msg: "Not found"});
  
  const updated = await Note.findOneAndUpdate(
    {_id: req.params.id, user: req.user},
    {pinned: !note.pinned},
    {returnDocument: 'after'}
  );
  res.json(updated);
});

// PERMANENT DELETE
router.delete('/:id', auth, async (req,res)=>{
  await Note.findOneAndDelete({_id: req.params.id, user: req.user});
  res.json({msg:"deleted"});
});

module.exports = router;