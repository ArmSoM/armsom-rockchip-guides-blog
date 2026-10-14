# Article discovery

The homepage shows six recent guides. The library renders nine article cards per page and offers search, topic, product and sorting controls. Filter state is stored in the URL; browser back/forward restores it. The JSON index contains article metadata only, not full article bodies.

Each article needs a `category`, a `products` array and its existing `translation_key`. Use category keys from `_data/hub.json`. Product tags describe boards actually covered by the guide. Related articles prefer the same category, then shared products, and exclude the current article.

Interface labels are in `_data/hub.json`; learning paths are in `_data/routes.json`. English, Chinese and Russian catalogs include only articles available in their language.

Static page links work without JavaScript. Search, filtering and sorting require JavaScript; if the index fails, static cards and numbered pages remain available. Current static page wrappers cover 20 articles in each of English, Chinese and Russian. When a language collection grows past its final nine-article page, add another `library/page-N/index.html` wrapper using layout `library`, the language, and `page_number: N`. Interactive pagination automatically adapts to the index.

The first article image loads eagerly; following images use native lazy loading. Relative Markdown asset paths are normalized by the article layout.

Local verification:

```sh
bundle exec jekyll build
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```
