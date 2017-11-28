# TODO

- Fix text position by percentages on mobile
- Improve per-meme text flow in CSS

BUILD
-----

    ionic serve
    ionic cordova run android --livereload

BIBLIOGRAPHY
------------
- https://medium.com/@leetheguy/adding-fonts-to-your-ionic-1-sass-app-dfbabf20dcaf

ANDROID DEV
-----------

http://ionicframework.com/docs/v1/guide/installation.html

Assuming Java, JDK, and Ant are installed with `ANT_HOME` set to the directory containing `bin/ant`, and `JAVA_HOME` is set.

Install  Android Studio.

Run  Android Studio, select the `Configure` drop down, select `SDK Manager`, use it to install the relevant SDK (1.7.1 for me) and the `Android API`.

Copy the `Android SDK Location` displayed at the top of the that Stuio window (eg `C:\Users\$username\AppData\Local\Android\Sdk`) into the env var `ANDROID_SDK`.

Add to `PATH` the values `$ANDROID_SDK/tools` and `$ANDROID_SDK/platform-tools`.

Sset mobile to Debugging mode (`Settings` > `About Phone`, and tap `Build number` seven times). Turn on `USB Debugging`.

Connect phone to PC via USB. Grant access rights and install Windows drivers for the mobile phone when prompted/donwload drivers from vendor's site.

On PC, run `adb devices` and check the mobile is listed, if not visit SO.

Finally, either launch the app by either:
- In MS VSC, add `Cordova Tools` and add debug targets in `launch.json`
- `ionic cordova run android --livereload`

