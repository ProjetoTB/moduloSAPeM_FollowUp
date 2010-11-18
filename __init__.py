#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os.path
from django.http import HttpResponse
from django.http import HttpResponseRedirect
import django.views.static as static

name = 'FollowUp'
version = 'v1.0.0'

def handle_request(request, fileName):
	curr_dir = os.path.realpath(os.path.dirname(__file__))
	media_dir = os.path.join(curr_dir, 'media')
	if fileName == '': fileName = "index.html"
	return static.serve(request, fileName, document_root=media_dir,
	show_indexes=True)

__all__ = ['name','version','handle_request']


