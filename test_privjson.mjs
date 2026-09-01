// PrivJSON 功能测试: 生成 52MB JSON → 浏览器加载解析 → 断言渲染/搜索/错误路径
import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

// 生成 ~52MB 测试文件: 20万条用户记录
const N = 200000;
const rows = [];
for (let i = 0; i < N; i++) rows.push({ id: i, name: `user_${i}`, email: `u${i}@x.com`, score: Math.random()*100, tags: ["a","b"], meta: { active: i%2===0, ts: 1750000000+i } });
const big = JSON.stringify(rows);
writeFileSync('/tmp/test_big.json', big);
console.log('test file MB:', (big.length/1048576).toFixed(1));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///srv/ai-stack/hermes/home/venture_lab/products/privjson/index.html', { waitUntil: 'load' });

// 注入文件（模拟拖入）
await page.setInputFiles('#fileInput', '/tmp/test_big.json');
await page.waitForFunction(() => document.getElementById('status').className.includes('ok'), { timeout: 60000 });
const status = await page.textContent('#status');
console.log('PARSE_OK:', status.trim().slice(0, 90));
const stSize = await page.textContent('#stSize');
const stTime = await page.textContent('#stTime');
console.log('size:', stSize, 'parse ms:', stTime);

// 树渲染断言
const nodes = await page.locator('#treeWrap div').count();
console.log('tree nodes rendered:', nodes);
if (nodes < 5) throw new Error('tree not rendered');

// 搜索断言
await page.fill('#search', 'user_199999');
await page.waitForTimeout(800);
const st = await page.textContent('#status');
console.log('search:', st.trim());
if (!/\d+ matches/.test(st)) throw new Error('deep search failed: ' + st);
// 无命中场景精确断言
await page.fill('#search', 'zzz_no_such_key_zzz');
await page.waitForTimeout(800);
const st2 = await page.textContent('#status');
console.log('search-none:', st2.trim());
if (!st2.startsWith('No matches')) throw new Error('no-match path broken');

// 错误路径: 坏 JSON
writeFileSync('/tmp/test_bad.json', '{oops:');
await page.setInputFiles('#fileInput', '/tmp/test_bad.json');
await page.waitForFunction(() => document.getElementById('status').className.includes('err'), { timeout: 15000 });
console.log('BAD_JSON_ERR:', (await page.textContent('#status')).trim());

// 隐私断言: 加载后无任何外部请求
const reqs = [];
page.on('request', r => reqs.push(r.url()));
await page.reload({ waitUntil: 'load' });
const external = reqs.filter(u => !u.startsWith('file://'));
console.log('external requests after load:', external.length);
if (external.length > 0) throw new Error('PRIVACY LEAK: ' + external[0]);

await page.screenshot({ path: '/srv/ai-stack/hermes/home/venture_lab/products/privjson/screenshot.png' });
if (errors.length) { console.log('PAGE_ERRORS:', errors); throw new Error('page errors'); }
console.log('PRIVJSON_ALL_TESTS_PASS');
await browser.close();
