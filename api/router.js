const router = require('express').Router();
const App = require("../controller/App.js");
const jwtAuth = require("../middleware/jwtauth.js");

router.get('/', App.index);
router.post('/login', App.login);
router.get('/chat', jwtAuth(), App.chat);
router.get('/destroy', jwtAuth(), App.destroy);

router.all('*', (req, res) => {
    res.status(404).send('404: Page not found');
});

module.exports = router;