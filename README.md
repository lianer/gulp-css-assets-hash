## feature
为css中引用的png,jpg,gif图片路径增加hash，hash只有在图片修改后才会变化。
```css
background-image: url("./a.jpg");
=>
background-image: url("./a.jpg?_=f7a915c");
```

## install
```bash
npm install gulp-css-assets-hash
```

## example
```js
var gulp = require('gulp');
var hash = require('gulp-css-assets-hash');

gulp.task('default', function () {
	gulp.src('src/a.css')
		.pipe(hash())
		.pipe(gulp.dest('dist'));
})
```
