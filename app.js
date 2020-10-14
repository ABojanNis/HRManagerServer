const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const candidatesRoutes = require('./routes/candidates');
const skillsRoutes = require('./routes/skills');
const experiencesRoutes = require('./routes/experiences');
const workerStatusesRoutes = require('./routes/workerStatuses');
const authRoutes = require('./routes/auth');

// DB config
const db = require('./config/keys').MongoURI;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/worker-statuses', workerStatusesRoutes);
app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const errors = error.errors;
  let message;
  if(error.message) {
    message = error.message;
  } else {
    message = 'Unprocessable Entity';
  }
  res.status(status).json({ success: false, message: message, errors: errors });
});

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch(err => console.log(err));