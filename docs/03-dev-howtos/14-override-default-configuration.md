# Overriding default configuration

Tired of pointing your `facia.stage` at `CODE`?  Have you ever longed to change the `content.api.host` you use for development?  Need to change some switches in `DEV`? Look no further!

## How-to

1. Create a file at `~/.gu/frontend.conf`
2. Add your configuration with the following syntax:

        devOverrides {
          key1.name=value1
          key2.name=value2
        }

    E.g.

        devOverrides {
          switches.key=DEV/config/switches-yournamehere.properties
          facia.stage=CODE
        }

3. If overriding switches, control what you want turned on in file switches-yournamehere.properties. Upload your file to the S3 frontend store bucket (aws-frontend-store/DEV/config).

4. Restart the app you're working on

## Notes

* You can see all configuration keys by looking at the [GuardianConfiguration class](https://github.com/guardian/frontend/blob/main/common/app/common/configuration.scala#L125)
