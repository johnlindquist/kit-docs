# View System Event Scripts

This menu shows scripts that run on system events.

Add the `System` metadata to run your script on a system event

```js
// System: unlock-screen
```

Available events:

- suspend
- resume
- on-ac
- on-battery
- shutdown
- lock-screen
- unlock-screen
- user-did-become-active
- user-did-resign-active
- Read about the available events [here](https://www.electronjs.org/docs/latest/api/power-monitor#events)

> Note: YMMV based on your specific machine setup.
