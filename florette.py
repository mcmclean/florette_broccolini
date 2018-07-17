#!/usr/bin/env python

import pandas as pd, numpy as np
# from sqlalchemy import create_engine, MetaData, Table, Column, Float, String, Integer
from flask import Flask, render_template, redirect, url_for, request, send_from_directory
import sys

################################################

def html_input(c):
	# return '<input name="{}" value="{{}}" />'.format(c)
	return '<input class="frame_input" name="{}" value="{{}}" />'.format(c)


# app = Flask(__name__)
app = Flask(__name__, static_url_path = '/static')


@app.route('/', methods = ['GET'])
def hello_world():
	return render_template('title.html', title = 'Test')

@app.route('/setup', methods = ['GET'])
def setup():
	return render_template('setup.html', title = 'Setup')

@app.route('/breakfast_draft', methods = ['GET'])
def breakfast_draft():
	return render_template('breakfast_draft.html', title = 'Breakfast')

@app.route('/soccer_good', methods = ['GET'])
def soccer_good():
	return render_template('soccer_good.html', title = 'Soccer - Good')

@app.route('/soccer_bad', methods = ['GET'])
def soccer_bad():
	return render_template('soccer_bad.html', title = 'Soccer - Bad')

@app.route('/lunch_draft', methods = ['GET'])
def lunch_draft():
	return render_template('lunch_draft.html', title = 'Lunch')

@app.route('/snack_draft', methods = ['GET'])
def snack_draft():
	return render_template('snack_draft.html', title = 'Snack')

@app.route('/dinner_draft', methods = ['GET'])
def dinner_draft():
	return render_template('dinner_draft.html', title = 'Dinner - Good')

@app.route('/dinner_draft_bad', methods = ['GET'])
def dinner_draft_bad():
	return render_template('dinner_draft_bad.html', title = 'Dinner - Bad')

@app.route('/info', methods = ['GET'])
def info():
	return render_template('info.html', title = 'Info')

@app.route('/summary', methods = ['GET'])
def summary():
	return render_template('summary.html', title = 'Summary')

@app.route('/static/<path:path>')
def send_static_file_(path):
	return send_from_directory('static', path)

@app.route('/frame')
def empty_frame():
	# import sys
	df = pd.DataFrame(columns = ['FoodGroup', 'Breakfast', 'Lunch', 'Snack', 'Dinner'])
	df['FoodGroup'] = pd.Series(['Grain', 'Vegetables', 'Fruits', 'Protein', 'Dairy'])
	for col in [x for x in df.columns if x is not 'FoodGroup']:
		df[col] = pd.Series([0 for x in range(len(list(df['FoodGroup'].values)))])
	# print(df, file=sys.stderr)

	breakfasts = {	1: {'Grain': 2, 'Vegetables': 0, 'Fruits': 1, 'Protein': 2, 'Dairy': 1},
					2: {'Grain': 1, 'Vegetables': 0.5, 'Fruits': 0.5, 'Protein': 1, 'Dairy': 1},
					3: {'Grain': 2, 'Vegetables': 0, 'Fruits': 0, 'Protein': 0, 'Dairy': 1}}
	lunches = 	{	1: {'Grain': 2, 'Vegetables': 1, 'Fruits': 0.5, 'Protein': 0, 'Dairy': 1},
					2: {'Grain': 2, 'Vegetables': 0, 'Fruits': 1, 'Protein': 3, 'Dairy': 2},
					3: {'Grain': 2, 'Vegetables': 0.75, 'Fruits': 0, 'Protein': 3, 'Dairy': 0.5}}
	snacks = 	{	1: {'Grain': 0, 'Vegetables': 1, 'Fruits': 0.5, 'Protein': 2, 'Dairy': 0},
					2: {'Grain': 0, 'Vegetables': 0, 'Fruits': 0, 'Protein': 1, 'Dairy': float(4/3)},
					3: {'Grain': 0, 'Vegetables': 0, 'Fruits': 1, 'Protein': 1, 'Dairy': 1}}
	dinners = 	{	1: {'Grain': 0, 'Vegetables': 2, 'Fruits': 0, 'Protein': 3, 'Dairy': 0},
					2: {'Grain': 0, 'Vegetables': 1.5, 'Fruits': 0, 'Protein': 1, 'Dairy': float(2/3)},
					3: {'Grain': 2, 'Vegetables': 1, 'Fruits': 0, 'Protein': float(1/2), 'Dairy': 2}}

	df.set_index(['FoodGroup'], inplace = True)

	return render_template('frame.html', frame = df.style.format({c: html_input(c) for c in df.columns}).render())


@app.route('/csv/<file>', methods = ['GET', 'POST'])
def serve_csv(file):
	import requests, io, sys
	s = requests.get('http://localhost:5000/static/data/' + file).content
	print(s, file = sys.stderr)
	# df = pd.read_csv(io.StringIO(s.decode('utf-8')))
	# return render_template('frame.html', frame = df.style.format({c: html_input(c) for c in df.columns}).render())



if __name__ == '__main__':
	app.run(port = 5000, threaded = True, debug = True)

'''

@app.route('/randomize/', methods = ['GET'])
def randomize():
	if request.method == "GET":
		engine, metadata = create_engine_metadata()
		df_new = pd.DataFrame(np.random.randn(10, 4), columns=list('ABCD')); df_new.index = pd.Series(list(range(10))); df_new.index.name = 'index'
		return render_template('home.html', frame = df_new.style.format({c: html_input(c) for c in df_new.columns}).render())
	else:
		sys.stderr.write("POST"); sys.stderr.write("\n")
		return render_template('home.html')


@app.route('/copy_from_db/', methods = ['GET'])
def copy():
	if request.method == "GET":
		TABLE_NAME = 'random_table'
		engine, metadata = create_engine_metadata()
		df_old = pd.read_sql_query('select * from "' + TABLE_NAME + '"', con=engine)
		df_old.set_index(df_old.columns[0], inplace = True)
		return render_template('home.html', frame = df_old.style.format({c: html_input(c) for c in df_old.columns}).render())
	else:
		sys.stderr.write("POST"); sys.stderr.write("\n")
		return render_template('home.html')


@app.route('/write/', methods = ['GET', 'POST'])
def submit_updated_tab():

	if request.method == "GET":

		whole_frame	= request.args.get('data')
		frame_arr	= whole_frame.split('&')

		TABLE_NAME	= 'random_table'
		engine, metadata = create_engine_metadata()

		df_old = pd.read_sql_query('select * from "' + TABLE_NAME + '"', con=engine)
		df_old.set_index(df_old.columns[0], inplace = True)

		df_new = pd.DataFrame()
		l_of_ls = [[] for x in range(len(df_old.columns))]
		for i in range(len(frame_arr)):
			l_of_ls[i % len(df_old.columns)].append(frame_arr[i])
		for l in l_of_ls:
			colname = l[0].split('=')[0]
			l = [x.split('=')[1] for x in l]
			df_new[colname] = pd.Series(l)
		# df_new  = df_new.astype(float)
		df_new.index.name = 'index'
		df_new = df_new[list(df_old.columns)]

		random_table = construct_table_schema(df_old, metadata, 'random_table')
		random_table.drop(engine)
		df_new.to_sql('random_table', engine)

		return render_template('home.html', frame = df_new.style.format({c: html_input(c) for c in df_new.columns}).render())

	else:

		sys.stderr.write("POST"); sys.stderr.write("\n")
		return render_template('home.html')

'''


'''
################################################

##### METHODS

def transform_type(intype): # http://docs.sqlalchemy.org/en/latest/core/type_basics.html#generic-types
	if intype == "float64":
		return Float
	elif intype == "int64":
		return Integer
	else:
		return String(255)

def construct_table_schema(inframe, db_meta, table_name):
	# get list of columns and data types --> consider forcing to string for mixed-type columns
	collist = [Column(x, transform_type(str(inframe[x].dtype))) for x in list(inframe.columns)]
	# define a table schema
	# http://docs.sqlalchemy.org/en/latest/core/metadata.html
	table	= Table(str(table_name), db_meta, *collist)
	return table


def html_input(c):
	# return '<input name="{}" value="{{}}" />'.format(c)
	return '<input class="frame_input" name="{}" value="{{}}" />'.format(c)

def create_engine_metadata():
	USERNAME	= 'postgres'
	PASSWORD	= 'password'
	HOST		= 'localhost'
	DBNAME		= 'postgres'
	PORT		= '5432'
	TABLE_NAME	= 'random_table'
	ENGINE		= create_engine('postgresql://' + USERNAME + ':' + PASSWORD + '@' + HOST + ':' + PORT + '/' + DBNAME)
	METADATA	= MetaData()

	return ENGINE, METADATA

'''