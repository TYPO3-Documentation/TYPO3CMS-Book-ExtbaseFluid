#!/usr/bin/env python
# encoding: utf-8
#
# Copyright (c) 2011 Documentation Team.  All rights reserved.
#
"""Integration of Sphinx with method.
"""

from docutils import nodes, utils

def method_role(name, rawtext, text, lineno, inliner, options={}, content=[]):
    inline = ''
    node = nodes.literal(inline, text)
    return [node], []

def setup(app):
    """Install the plugin.
    
    :param app: Sphinx application context.
    """

    app.add_role('method', method_role)
    return
