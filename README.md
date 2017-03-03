![alt text](src/public/images/logo.png "InVira Chat")

InVira Presentation Framework
=====================

Presentation Framework with Online Editor and Dashboard for your Presentations.

This was a proof-of-concept prototype and is by far not finished. It was developed in under a week and is no longer in development.

![alt text](screenshots/editor.jpg "Editor Screen")

## Live Demo
Live Demo is hosted on Heroku

[Live Demo](http://invira.herokuapp.com/)

## Build & development

Before you can start you have to change the mongodb url in `src/config/env/development.js` and the app id's for facebook, twitter and google authentication in `src/config/auth.js`

Run `grunt` for dev building, `grunt dist` for distribution  and `grunt serve` for preview.

## License

    Copyright (c) 2015 Henry Keller <henry@creativemind.info>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
