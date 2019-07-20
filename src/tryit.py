# WELCOME TO LIVE DEMO OF https://github.com/nat-chan/vim.wasm.ipynb !
#
# - press Shift-Enter in normal mode to execute the entire file.
# - To execute selected part, you can also use Shift-Enter in visual mode.
#
# please see ~/tryit.js or ~/.vim/vimrc for more information.
# Enjoy! (U'ω')

import plotly.express as px
iris = px.data.iris()
fig = px.scatter_3d(iris,
        x="sepal_length",
        y="sepal_width",
        z="petal_width",
        color="species")
fig.show()
