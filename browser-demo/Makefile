all: src/bls-demo.js public/bls-demo.html

src/bls-demo.js: ../bls-demo.js 
	-@mkdir -p src
	echo '// automatically generated' > $@
	echo 'const bls = require("../../index-browser")' >> $@
	sed /@@@/d ../bls-demo.js >> $@

public/bls-demo.html: ../bls-demo.html
	-@mkdir -p public
	sed /\<script/d ../bls-demo.html >> $@

clean:
	rm -rf src/bls-demo.js public/bls-demo.html	
