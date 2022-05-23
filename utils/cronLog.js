const CronJob = require('cron').CronJob;

const { EXPORT_EXCEL_TIME } = require('./exportExcel');

/**
 * Time is String follow format
 * FORMAT_TIME_PARAMS: 'ss mm hh * * dayStartInWeek - dayEndInWeek'
 * With the day follow this rules: Monday => 0, Tuesday => 1,... Saturday => 6, Sunday => 7
 *  Seconds: 0-59
 *  Minutes: 0-59
 *  Hours: 0-23
 *  Day of Month: 1-31
 *  Months: 0-11 (Jan-Dec)
 *  Day of Week: 0-6 (Sun-Sat)
 */
exports.CRON_LOG_TIME = (time) => {
    let job = new CronJob({
        cronTime: time,
        onTick: function() {
            /*
            * Runs every weekday (Monday through Friday)
            * at 11:30:00 AM. It does not run on Saturday
            * or Sunday.
            */
            let currentTime = new Date();
            EXPORT_EXCEL_TIME(`Sheet 1`, currentTime);
        }, 
        start: true, /* Start the job right now */
        timeZone: 'Asia/Ho_Chi_Minh' /* Time zone of this job. */
    });

    job.start();

    return job;
}