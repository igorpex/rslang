import './style.scss';

const $root = document.getElementById('root')!;
const $hello = document.createElement('h1');
$hello.innerText = 'Hello RS Lang!';
$root.append($hello);
