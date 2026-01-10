// these are some route for each different processes
const User = require('../model/user');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

// route export for signup
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, age, gender } = req.body;
    console.log("Signup form data:", req.body); // 👀 debug
    const newUser = new User({ username, email, phone, age, gender });
    const registeredUser = await User.register(newUser, password);
    console.log("User saved:", registeredUser);
    res.redirect('/login');
    req.flash('success', 'Account created! Please login');
  } catch (e) {
    console.log("Signup error:", e);
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

// route for login form rendering
module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

// route for login form
module.exports.login = async (req, res) => {
  
  let redirectUrl = res.locals.redirectUrl || '/main';
  res.redirect(redirectUrl);
};

// route for logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'you are logged out!');
    res.redirect('/main');
  });
};
