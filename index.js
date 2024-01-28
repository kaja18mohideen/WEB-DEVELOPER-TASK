const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/mentor_student_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Body parser middleware
app.use(bodyParser.json());

// MongoDB schema and model
const mentorSchema = new mongoose.Schema({
  name: String,
});

const studentSchema = new mongoose.Schema({
  name: String,
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
  },
});

const Mentor = mongoose.model('Mentor', mentorSchema);
const Student = mongoose.model('Student', studentSchema);

// API to create a mentor
app.post('/api/mentors', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to create a student
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to assign a student to a mentor
app.post('/api/assign-mentor/:mentorId/:studentId', async (req, res) => {
  try {
    const { mentorId, studentId } = req.params;
    const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to show all students for a particular mentor
app.get('/api/students/:mentorId', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to show the previously assigned mentor for a particular student
app.get('/api/student-mentor/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('mentor');
    res.json(student.mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('Welcome to the Mentor-Student API');
  });
  