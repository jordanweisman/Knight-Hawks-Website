FROM nginx:stable-alpine

# Copy everything to a temporary folder
COPY . /tmp/site

# If your single HTML file has a non-index name, move it to index.html so nginx serves it.
RUN mv "/tmp/site/Knight Hawks Website V28 improved Comcis and Serials.html" /usr/share/nginx/html/index.html || true

# Copy any other static assets into nginx's html directory
RUN cp -r /tmp/site/* /usr/share/nginx/html/ || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
