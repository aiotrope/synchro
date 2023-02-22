from django.utils.deprecation import MiddlewareMixin


class AccessControlAllowOriginMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Credentials"] = "True"
        response["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin,X-Requested-With,Content-Type,Access-Control-Allow-Headers,authorization,Accept,content-type,application/json"
        response["Access-Control-Max-Age"] = "3600"
        return response
