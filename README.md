
https://mellullaby.herokuapp.com/

------------------------------------------------

-----Sign up----
POST: /api/auth/register (x-www-form-urlencoded)
	email
	username
	password

----Sign in-----
POST: /api/auth/login (x-www-form-urlencoded)
	email
	password

----Reset Password----
POST: /api/auth/recover (x-www-form-urlencoded)
	email

----Refresh Token----
POST: /api/auth/refreshtoken (x-www-form-urlencoded)
	email
	token(refresh token)

----Sign out----
DELETE: /api/auth/logout (x-www-form-urlencoded)
	token(refresh token)


----auth: bearer token------Gửi kèm token------------

-----Update Profile----
PUT: /api/user/update (x-www-form-urlencoded)----profile------
	nickname
	numphone
	sex
	datebirth
	address

----Update Profile Image------
PUT: /api/user/update (form-data)---profile image-----
	file

-----Show user info-----
GET: /api/user/show (x-www-form-urlencoded)

-----Display Image-------
GET: /api/user/image/:filename

-----Create Event--------
POST: /api/user/event

-----Update Event--------
PUT: /api/user/eventupdate
	id(id sự kiện)
	event(tên sự kiện)
	address(nơi tổ chức)
	bio(mô tả)
	catelogy(loại sự kiện)
	date(ngày diễn ra)
	time(giờ diễn ra)
	group(nhóm sự kiện. VD: Bên nội)
	eventImage(ảnh sự kiện)

-----GET All Events--------
GET: /api/user/eventshow (trả về toàn bộ sự kiện của user đó)

-----Get Event By Id---------
POST: /api/user/eventshowone (trả về sự kiện theo ID)
	id(id sự kiện)

-----DELETE Event------
DELETE: /api/user/destroyevent (xóa sự kiện theo ID)
	id(id sự kiện)

-----Create Family--------
POST: /api/user/family (khi tạo mới family thì trường firstname, lastname sẽ được gán 1 tên mặc định vì 2 trường đó yêu cầu required)

-----Update Family--------
PUT: /api/user/familyupdate
	id(id family)
	firstname
	middlename
	lastname
	email
	nickname
	numphone
	sex
	datebirth
	address
	job(nghề nghiệp)
	parentage(dòng họ. VD: Bên nội)
	yourself(danh xưng của bạn)
	relatives(danh xưng của người thân)
	nation(dân tộc)
	religion (tôn giáo)
	profileImage(ảnh của người thân)

-----GET All Familys--------
GET: /api/user/familyshow (trả về danh sách family của user đó)

-----Get Family By ID---------
POST: /api/user/familyshowone (trả về family theo ID)
	id(id family)

-----DELETE Family------
DELETE: /api/user/destroyfamily (xóa family theo ID)
	id(id family)

-----Search Family---------
POST: /api/user/familyshowone (tìm kiếm family theo tên dựa vào trường lastname có phân biệt dấu tiếng Việt, dấu cách, xuống dòng.... VD: nhập name='th' sẽ trả về tên có chứa chuỗi 'th')
	name(nội dung cần search)