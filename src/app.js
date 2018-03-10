const Koa = require('koa');
const Router = require('koa-router');
const pug = require('pug');

const router = new Router();

const {
  Team,
  Matches,
  Event,
  TeamEvent,
  TeamYear,
} = require('./models');

// API
router.get('/team/:number', async (ctx) => {
  ctx.body = await Team.get(ctx.params.number, ctx.query.refresh);
});

router.get('/event/:key', async (ctx) => {
  ctx.body = await Event.get(ctx.params.key, ctx.query.refresh);
});

router.get('/event/:key/matches', async (ctx) => {
  ctx.body = await Matches.get(ctx.params.key, ctx.query.refresh);
});

router.get('/team/:number/event/:key', async (ctx) => {
  ctx.body = await TeamEvent.get(ctx.params.number, ctx.params.key, ctx.query.refresh);
});

router.get('/team/:number/:year', async (ctx) => {
  ctx.body = await TeamYear.get(ctx.params.number, ctx.params.year, ctx.query.refresh);
});

// Views
const addView = (path, view, getModel) => {
  router.get(path, async (ctx) => {
    ctx.body = pug.renderFile(`./views/${view}.pug`, await getModel(ctx));
  });
};

addView('/', 'index', async (ctx) => {
  const data = await TeamYear.get(254, 2018);
  return { data };
});

new Koa()
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 4334);

console.log(`Server on localhost:${process.env.PORT || 4334}`);
