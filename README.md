# Community Regions

A simple link page for Elastic community program managers, one page per region, automatically published whenever you update a file.

**Live pages**
- India: `/india`
- Europe: `/europe`
- United States: `/us`
- Australia: `/australia`
- Singapore: `/singapore`

## How to update your region's links

You don't need to install anything. Everything is done right here on GitHub.

**1. Find your region's file**

Go to the [`regions/`](./regions/) folder and click on your file (e.g. `india.json`).

**2. Click the pencil icon to edit**

You'll see a pencil icon in the top-right corner of the file. Click it.

**3. Update the links**

Each link looks like this:

```json
{ "title": "Join our Meetup", "url": "https://meetup.com/your-group" }
```

Change the `title` (what the button says) or the `url` (where it goes). You can also reorder links by cutting and pasting lines.

**4. Save (commit) your changes**

Scroll down, write a short note about what you changed (e.g. "Updated meetup link"), and click **Commit changes**.

Your page will be live within about a minute.

## Adding or removing a link

To **add** a link, copy an existing line and paste it below, then update the title and URL.

To **remove** a link, delete its line. Make sure the commas between items stay correct as the last item in a list should have no trailing comma.

## Need help?

Reach out to Som or Kartikay and we'll be happy to help.

## Contributing

Have an idea or spotted something that needs fixing? Feel free to open an issue in this repo and we'll take a look.

## Credits

Inspired by [LittleLink](https://github.com/sethcottle/littlelink) by Seth Cottle.
