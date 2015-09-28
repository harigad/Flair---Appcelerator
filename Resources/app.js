/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 *
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *
 */

Ti.App.isIos = Titanium.Platform.name != 'android' ? true : false;

// This is a single context application with mutliple windows in a stack
(function() {

	if (Ti.App.isIos) {
		registerForApplePushNotification();
	} else {
		registerForAndroidGCMPushNotification();
	}

	var App = require('/ui/handheld/ApplicationWindow');

	/*
	 //determine platform and form factor and render approproate components
	 var osname = Ti.Platform.osname,
	 version = Ti.Platform.version,
	 height = Ti.Platform.displayCaps.platformHeight,
	 width = Ti.Platform.displayCaps.platformWidth;

	 //considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	 //yourself what you consider a tablet form factor for android
	 var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	 var App;

	 if (isTablet) {
	 App = require('ui/tablet/ApplicationWindow');
	 } else {
	 // Android uses platform-specific properties to create windows.
	 // All other platforms follow a similar UI pattern.
	 if (osname === 'android') {
	 App = require('ui/handheld/android/ApplicationWindow');
	 } else {
	 App = require('ui/handheld/ApplicationWindow');
	 }
	 }*/

	App.init();

})();

function registerForAndroidGCMPushNotification() {

}

function registerForApplePushNotification() {

	var deviceToken = null;
	// Check if the device is running iOS 8 or later
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {

		// Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

			// Remove event listener once registered for push notifications
			Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

			Ti.Network.registerForPushNotifications({
				success : deviceTokenSuccess,
				error : deviceTokenError,
				callback : receivePush
			});
		});

		// Register notification types to use
		Ti.App.iOS.registerUserNotificationSettings({
			types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
		});
	}

	// For iOS 7 and earlier
	else {
		//alert(2);
		Ti.Network.registerForPushNotifications({
			// Specifies which notifications to receive
			types : [Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND],
			success : deviceTokenSuccess,
			error : deviceTokenError,
			callback : receivePush
		});
	}
	// Process incoming push notifications
	function receivePush(e) {
		Ti.App.fireEvent("notificationRecieved");

		//alert('Received push: ' + JSON.stringify(e));

		//Ti.App.fireEvent("updateNotifCount");

		var pushAlert = Ti.UI.createAlertDialog({
			title : "Notification!",
			message : e.data.alert.body,
			buttonNames : ["Close", "View"]
		});

		pushAlert.addEventListener('click', function(e) {

			if (e.index == 1) {

				var notifWindow = require('ui/common/notifications/notifications');
				notifWindow.init();

			}
		});
		//pushAlert.show();

	}

	// Save the device token for subsequent API calls
	function deviceTokenSuccess(e) {

		Ti.App.Properties.setString('push_token', e.deviceToken);
		//alert("deviceToken=" + e.deviceToken);
		//413f9a8e8e3bc47a21e44cc2469d570dec33d447b4a4c92cd459d7de780d27e0

	}

	function deviceTokenError(e) {
		//alert('Failed to register for push notifications! ' + e.error);
	}

}

