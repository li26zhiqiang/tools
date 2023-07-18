FROM anolis-registry.cn-zhangjiakou.cr.aliyuncs.com/openanolis/nginx:1.14.1-8.6
MAINTAINER david.w
EXPOSE 10010
COPY nginx_default.conf /etc/nginx/conf.d/
COPY ./dist  /usr/share/nginx/html/iam
RUN echo 'build image success!!'
# docker run -d -it --restart=on-failure:3 --name microapp -p 10010:10010 244341b5bc37
# docker build -t microapp:latest .
