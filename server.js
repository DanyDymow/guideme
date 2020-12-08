const  express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/trips', require('./routes/api/trips'));
app.use('/api/tripProfile', require('./routes/api/tripProfile'));
app.use('/api/points', require('./routes/api/points'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));