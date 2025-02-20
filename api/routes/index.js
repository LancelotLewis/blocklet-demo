const middlewares = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const { Auth } = require('@blocklet/sdk');

router.get('/userinfo', middlewares.session(), async (req, res) => {
  const auth = new Auth();
  console.log(req.user);
  const { user } = await auth.getUser(req.user.did);
  res.json({ ...user, role: req.user.role });
});

module.exports = router;
