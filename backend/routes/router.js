const express = require("express");
const router = express.Router();
const questionDB = require("../models/Question");
const answerDB = require("../models/Answer");
const verifyToken = require("../auth/authMiddleware"); // Import the verifyToken middleware
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const key = 'srushtisrushtisrushtisrushtisrus'


// Protected route - Add a new question
router.post("/addquestions", async (req, res) => {
  console.log("hi");
  try {
    const { questionName, questionUrl, username, section } = req.body;
    const question = new questionDB({
      questionName,
      questionUrl,
      username,
      section,
    });
    await question.save();
    res.status(201).send({ message: 'question added successfully' });
  } catch (error) {
    console.error('Error while adding question:', error);
    res.status(500).send({ message: 'Error while adding question' });
  }
});

// Protected route - Get all questions
router.get("/getquestions", async (req, res) => {
  try {
    await questionDB
      .aggregate([
        {
          $lookup: {
            from: "answers", // collection to join
            localField: "_id", // field from input document
            foreignField: "questionId",
            as: "allAnswers", // output array field
          },
        },

      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
      })
      .catch((error) => {
        res.status(500).send({
          status: false,
          message: "Unable to get the question details",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Unexpected error",
    });
  }
});


router.get('/getquestionsofuser/:userId', async (req, res) => {
  try {
    
    const userId = req.params.userId;
    console.log(userId);
    await questionDB
      .aggregate([
        {
          $match: {
            username: userId, // Match questions for the specific user
          },
        },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
            as: 'allAnswers',
          },
        },
      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
      })
      .catch((error) => {
        res.status(500).send({
          status: false,
          message: 'Unable to get the question details',
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: 'Unexpected error',
    });
  }
});





router.post("/addcomment", async (req, res) => {

  try {
    const { comment, questionId, username } = req.body;
    console.log(req.body);
    const question = await questionDB.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.comments.push({ username, text: comment });
    await question.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error in adding comment" });
  }
});



// Protected route - Add a new answer
router.post("/addanswers", async (req, res) => {

  try {
    const { answer, questionId, username } = req.body;
    const ans = new answerDB({
      answer,
      questionId,
      username,
    });
    await ans.save();
    res.status(201).send({ message: 'answer added succsessfully' });
  } catch (error) {
    console.error('Error while adding :', error);
    res.status(500).send({ message: 'Error while adding question' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error while registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, key); // Replace with your secret key
    res.status(200).json({ token, user }); // Move this line here
  } catch (error) {
    res.status(500).send({ message: 'Error while logging in' });
  }
});


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "golsrushti1@gmail.com", // Your Gmail email address
    pass: "bhabytwxnleqzcbe", // Your Gmail password or app password
  },
});

router.post('/sendmail', async (req, res) => {
  const { email } = req.body;
  const sendRegistrationEmail = (userEmail) => {
    const mailOptions = {
      from: "golsrushti1@gmail.com",
      to: userEmail,
      subject: "Welcome to Our App!",
      text: "Thank you for registering on our app. We're excited to have you!, you need to verify email by typing code:121103",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  };

  await sendRegistrationEmail(email);
});


router.post('/sendmailforgetanswer', async (req, res) => {
  const { username, text } = req.body;
  const user = await User.findOne({ username });

  const sendRegistrationEmail = () => {
    const mailOptions = {
      from: "golsrushti1@gmail.com",
      to: user.email,
      subject: "You got the Answer of your Question",
      html: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  };

  await sendRegistrationEmail();

});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; 

    const results = await questionDB
      .aggregate([
        {
          $match: {
            $text: { $search: query },
          },
        },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
            as: 'allAnswers',
          },
        },
      ])
      .exec();

    res.status(200).json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error in search" });
  }
});
router.delete('/api/questions/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {

    const question = await questionDB.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.remove();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

// Express route for deleting an answer
router.delete('/api/answers/:answerId', async (req, res) => {
  const { answerId } = req.params;

  try {

    const answer = await answerDB.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    await answer.remove();

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error deleting answer' });
  }
});

router.delete('/api/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {

    const comment = await commentDB.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.remove();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
});



module.exports = router;

