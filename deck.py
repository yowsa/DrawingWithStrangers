def deco(afunc):
	def _deco(y):
		afunc(y+"!")
	return _deco


@deco
@deco
@deco
def myfunc(x):
	print (x)


myfunc("hejsan")


