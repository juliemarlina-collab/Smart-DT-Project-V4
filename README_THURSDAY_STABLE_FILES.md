# Smart DT Thursday Stable Files

This package contains the three requested files:

```text
js/smartdt-no-gates.js
css/smartdt-responsive-fix.css
html-snippets/dashboard-clean-section.html
```

## Upload location

Upload the files into your repo using the same paths:

```text
Smart-DT-Project-V4/
  js/smartdt-no-gates.js
  css/smartdt-responsive-fix.css
```

For the HTML snippet, copy the content from:

```text
html-snippets/dashboard-clean-section.html
```

and paste it into `dashboard.html` where you want the clean dashboard card section to appear.

## Add to HTML pages

Add this CSS line inside `<head>` after `smartdt.css`:

```html
<link rel="stylesheet" href="css/smartdt-responsive-fix.css"/>
```

Add this JS line before `smartdt.js`:

```html
<script src="js/smartdt-no-gates.js"></script>
```

Recommended order:

```html
<script src="js/smartdt-assets.js"></script>
<script src="js/smartdt-no-gates.js"></script>
<script src="js/smartdt.js"></script>
```

## Save Draft button example

Use this button inside each template form/card:

```html
<button type="button" class="btn teal full" onclick="saveTemplateDraft('T01')">
  Save T01 Draft
</button>
```

Repeat with `T02`, `T03`, and `T04`.
