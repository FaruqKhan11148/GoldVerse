// these are some route for each different process
const User = require('../model/user');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, age, gender } = req.body;
    console.log("Signup form data:", req.body); // 👀 debug

    const newUser = new User({ username, email, phone, age, gender });
    const registeredUser = await User.register(newUser, password);
    console.log("User saved:", registeredUser); 

    req.flash('success', 'Account created! Please login');
    res.redirect('/login');
    
  } catch (e) {
    console.log("Signup error:", e);
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  req.flash('success', 'Welcom back to Fetify!');
  let redirectUrl = res.locals.redirectUrl || '/main';
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'you are logged out!');
    res.redirect('/main');
  });
};
