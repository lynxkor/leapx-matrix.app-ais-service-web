#FROM nginx
FROM lpdocker.leapmotor.com/dz-network/secbase-images/nginx:1.28.3-debian-13-1
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


COPY ./nginx.conf  /etc/nginx/
COPY ./dist /usr/share/nginx/html/

# 复制启动脚本及配置文件
COPY ./.env.* /etc/config/
COPY ./docker-entrypoint.sh /docker-entrypoint.sh

# 关键：修复权限确保 nginx 用户可以写访问日志
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chown nginx:nginx /var/log/nginx/*.log

RUN chown -R nginx:nginx /etc/config/ && \
    chown -R nginx:nginx /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

USER nginx

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
