import numpy as np

arr_1 = np.arange(5)
arr_2 = np.arange(6, 10)
arr_3 = np.array(['First', 'Second', 'Third', 'Fourth', 'Fifth'])

mask = np.logical_and(arr_1 < 3, arr_2 > 3)
print(arr_3[mask])
