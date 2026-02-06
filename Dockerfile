FROM nginx:stable-alpine

# Copy everything to a temporary folder
COPY . /tmp/site

# If your single HTML file has a non-index name, move it to index.html so nginx serves it.
RUN mv "/tmp/site/Knight Hawks Website V28 improved Comcis and Serials.html" /usr/share/nginx/html/index.html || true

# Copy any other static assets into nginx's html directory
RUN cp -r /tmp/site/* /usr/share/nginx/html/ || true

# Replace the default nginx config with one that listens on port 8000
RUN printf 'server {\n    listen 8000;\n    listen [::]:8000;\n    server_name _;\n    location / {\n        root /usr/share/nginx/html;\n        index index.html index.htm;\n    }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8000

# Use a simple entrypoint that just starts nginx without the official entrypoint
CMD nginx -g 'daemon off;'
