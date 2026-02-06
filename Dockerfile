FROM nginx:stable-alpine

# Copy everything to a temporary folder
COPY . /tmp/site

# If your single HTML file has a non-index name, move it to index.html so nginx serves it.
RUN mv "/tmp/site/Knight Hawks Website V28 improved Comcis and Serials.html" /usr/share/nginx/html/index.html || true

# Copy any other static assets into nginx's html directory
RUN cp -r /tmp/site/* /usr/share/nginx/html/ || true

# Configure nginx to listen on port 8000 (Koyeb default)
RUN sed -i 's/listen 80;/listen 8000;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
