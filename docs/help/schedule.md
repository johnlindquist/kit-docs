<meta path="help/schedule">
      
# Schedule a Script

Use cron syntax to run scripts on a schedule:

```js
// Schedule: */10 * * * * *
```

> Note: these scripts must not include `arg` or they will time out after 10 seconds
