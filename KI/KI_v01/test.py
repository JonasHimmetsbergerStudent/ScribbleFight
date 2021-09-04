from selenium.webdriver.common.action_chains import ActionChains
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import win32api


win32api.SetCursorPos((0, 0))

options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
driver = webdriver.Chrome(chrome_options=options,
                          executable_path=ChromeDriverManager().install())


driver.get(
    'file:///C:/Users/Nonsas/Documents/Schule/Diplomarbeit/ScribbleFight/KI/KI_v01/index.html')
# driver.set_window_position(-8, -8)
print(driver.get_window_size())

position = driver.get_window_position()
drx = position.get('x')
dry = position.get('y')
print(drx)
print(dry)

print(driver.execute_script(
    "return {'iwidth':window.innerWidth, 'iheight':window.innerHeight, 'owidth':window.outerWidth, 'oheight':window.outerHeight} ;"))
print(driver.current_url)


'''driver.get("http://www.google.com")

x = 600
y = 130
script = 'document.elementFromPoint(%s, %s).click();' % (x, y)
driver.execute_script(script)
print(script)'''

'''document.onmousemove = function(event) {
	console.log(event.pageX);
	console.log(event.pageY);
}'''


'''
import win32api
import win32con
def click(x, y):
    win32api.SetCursorPos((x, y))
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, x, y, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, x, y, 0, 0)


click(100, 200)
click(100, 200)'''
