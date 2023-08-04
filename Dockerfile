FROM anolis-registry.cn-zhangjiakou.cr.aliyuncs.com/openanolis/nginx:1.14.1-8.6
MAINTAINER david.w
EXPOSE 80
COPY nginx.conf /etc/nginx/
COPY nginx_default.conf /etc/nginx/conf.d/
COPY ./build  /usr/share/nginx/html/aitools
RUN echo 'build image success!!'
# docker run -d -it --restart=on-failure:3 --name microapp -p 10010:10010 244341b5bc37
# docker build -t microapp:latest .