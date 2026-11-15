# Validate the Blog's identity registry and source mappings without network access.
require 'json'
require 'yaml'
require 'date'
require 'uri'
root = File.expand_path('..', __dir__)
read = ->(name) { JSON.parse(File.read(File.join(root, '_data', name), encoding: 'UTF-8')) }
products = read.call('products.json')
aliases = read.call('product_aliases.json')
boards = read.call('home_boards.yml')
sources = read.call('article_evidence.json')
errors = []
products.each do |name, product|
  errors << "Registry name mismatch: #{name}" unless product['name'] == name
  errors << "Missing canonical alias: #{name}" unless aliases[name] == name
  product['aliases'].each { |a| errors << "Invalid alias #{a}" unless aliases[a] == name }
  %w[docs product_url].each do |field|
    next if product[field].nil?
    uri = URI(product[field])
    allowed = field == 'docs' ? ['docs.armsom.org'] : ['www.armsom.org', 'armsom.org']
    errors << "Unexpected #{field} for #{name}" unless uri.scheme == 'https' && allowed.include?(uri.host)
  end
  errors << "Missing identity evidence: #{name}" unless product.dig('evidence', 'url') == product['docs']
end
aliases.each { |a, name| errors << "Orphan alias #{a}" unless products.key?(name) }
errors << 'Duplicate homepage board' unless boards.uniq == boards
boards.each { |name| errors << "Unknown homepage board #{name}" unless products.key?(name) }
articles = Dir.glob(File.join(root, '_articles*', '*.md')).map do |path|
  text = File.read(path, encoding: 'UTF-8')
  fm = text.split(/^---\s*$\n?/, 3)[1]
  data = YAML.safe_load(fm, permitted_classes: [Date, Time], aliases: true)
  lang = File.basename(File.dirname(path)).delete_prefix('_articles').delete_prefix('_')
  data['lang'] ||= lang.empty? ? 'en' : lang
  (Array(data['products']) + Array(data['reference_products'])).each do |name|
    errors << "Unmapped article product #{name}: #{File.basename(path)}" unless aliases.key?(name)
  end
  data
end
sources.each do |key, record|
  variants = articles.select { |a| a['translation_key'] == key }.map { |a| a['lang'] }.sort
  errors << "Missing language version: #{key}" unless variants == %w[de en ru zh]
  errors << "Incomplete localized scope: #{key}" unless record['scope'].keys.sort == %w[de en ru zh]
  record['sources'].each do |source|
    errors << "Empty source label: #{key}" if source['label'].to_s.empty?
    url = source['url']
    if url.start_with?('/articles/')
      slug = url.split('/')[2]
      %w[_articles _articles_zh _articles_ru _articles_de].each do |collection|
        errors << "Missing internal source #{collection}/#{slug}" unless File.file?(File.join(root, collection, "#{slug}.md"))
      end
    else
      errors << "Non-HTTPS source #{key}" unless URI(url).scheme == 'https'
    end
  end
end
abort errors.join("\n") unless errors.empty?
puts "PASS: #{products.size} product identities, #{aliases.size} aliases, #{articles.size} article variants, #{sources.size * 4} localized scope/source panels."
