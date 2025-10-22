FROM nginx

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./conf/nginx.conf  /etc/nginx/

COPY ./dist /usr/share/nginx/html/

EXPOSE 80