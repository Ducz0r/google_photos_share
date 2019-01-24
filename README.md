## Google Photos Share

I've created this _nifty_ static page to help me with embedding Google Photos into my Wordpress blog. You see, for at least last 6 years, I've been using Google as my photo storage of choice, and I've always found a way to embed specific photos into my Wordpress blog. Once Picasa Albums were migrated onto Google Photos, I had to start using [Photo Express for Google](https://wordpress.org/plugins/photo-express-for-google/) plugin. While the plugin worked as intended, I was always fearful as it was vastly undermaintained.

Now, with the migration of Wordpress onto the Gutenberg rich text editor (which I _love_, by the way!), the plugin, naturally, stopped working. And there are no similar alternatives at the moment!

That's why I've written this very basic Google Photos scrapper website. It can take a Google Photos Share URL, and it will parse all the image thumbnail & hyperlinks out from it, or even generate HTML with image thumbnails that I can inject directly into my blog.

### Assumptions/prerequisites

Oh boy, there are many of these.

* Due to the fact that I'm scraping the Google Photos page using JavaScript, I need to use [CORS Anywhere](https://cors-anywhere.herokuapp.com/) - which it's assumed it works and is alive and kicking.
* (for Wordpress HTML) [Fancybox 3](https://fancyapps.com/fancybox/3/) is used on the Wordpress blog to preview images - I use [FancyBox for WordPress](https://wordpress.org/plugins/fancybox-for-wordpress/) plugin.
  * I've encountered some issues when previewing the full-size images in the Fancybox on the website: it seems that the Fancybox somehow cannot calculate the full image size, and the result is that the fancybox image modal window/popover contains large heaps of white color, which looks very ugly. I've used the following 2 tricks to make it better:
  * The FancyBox for WordPress plugin allows custom JavaScript on callbacks; I've specified the following JS on the **Complete** callback:
  ```javascript
  function() {
      var s = this.$thumb.closest('.fancyboxforwp').data('size').split('x');
      this.$slide.find('.fancybox-content').css('width', s[0]).css('height', s[1]);
  }
  ```
  * I've also added the following CSS to my WordPress theme's additional CSS:
  ```css
  .fancybox-slide--iframe .fancybox-content {
      background: transparent;
  }
  ```

* And probably the biggest assumption of all, it's assumed that the Google Photos web application remains as it is, and keeps the same JavaScript for handling images, so the scraper doesn't start failing uncontrollably.