npm ci

npx react-codemod class example.jsx --force
npx react-codemod React-PropTypes-to-prop-types example.jsx --force


npx jscodeshift code.js -t transform.js
git checkout -- code.js