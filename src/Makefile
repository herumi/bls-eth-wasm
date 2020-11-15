all: bls_c.js

EMCC_OPT=-I ./bls/include -I ./mcl/src -I ./mcl/include -I./bls -Wall -Wextra
EMCC_OPT+=-O3 -DNDEBUG
EMCC_OPT+=-s WASM=1 -s NO_EXIT_RUNTIME=1 -s NODEJS_CATCH_EXIT=0 -s NODEJS_CATCH_REJECTION=0 #-s ASSERTIONS=1
EMCC_OPT+=-s MODULARIZE=1
#EMCC_OPT+=-s EXPORT_NAME='blsCreateModule'
EMCC_OPT+=-s STRICT_JS=1
EMCC_OPT+=-s SINGLE_FILE=1
#EMCC_OPT+=-s MINIFY_HTML=0
EMCC_OPT+=--minify 0
EMCC_OPT+=-DCYBOZU_MINIMUM_EXCEPTION
EMCC_OPT+=-s ABORTING_MALLOC=0

bls_c.js:
	emcc -o $@ bls/src/bls_c384_256.cpp mcl/src/fp.cpp $(EMCC_OPT) -DMCL_MAX_BIT_SIZE=384 -DBLS_ETH -DMCL_USE_WEB_CRYPTO_API -s DISABLE_EXCEPTION_CATCHING=1 -DCYBOZU_DONT_USE_EXCEPTION -DCYBOZU_DONT_USE_STRING -DMCL_DONT_USE_CSPRNG -fno-exceptions
	# disable require fs, path
	perl -i -pe 's@(.* = require\(.*)@//\1@' $@

clean:
	rm -rf bls_c.js

.PHONY: clean bls_c.js

