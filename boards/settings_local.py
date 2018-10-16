# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '9i=qmgy5-8c&i)2aqfr!9i1z1el+1han%76t+&2c9=(pto$h=*'
 # admins
ADMINS = (('Romanm', 'AnonimFakeov@gmail.com'),)
 # email settings
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'AnonimFakeov@gmail.com'
EMAIL_HOST_PASSWORD = 'Vice2014Versa'
EMAIL_PORT = 587
 # SOCIAL_AUTH_FACEBOOK_API_VERSION = '3.1'
SOCIAL_AUTH_FACEBOOK_KEY = '475548252848714'
SOCIAL_AUTH_FACEBOOK_SECRET = 'cee11fad8d56de9a195052d9371a9a79'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email', ]
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'id,name,email',
}
SOCIAL_AUTH_ADMIN_USER_SEARCH_FIELDS = [
    'email', 'username', 'first_name', 'last_name'
]
SOCIAL_AUTH_FACEBOOK_AUTH_EXTRA_ARGUMENTS = {'display': 'touch'}
SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'xxx'
SOCIAL_AUTH_FACEBOOK_LOGIN_URL = 'xxx'