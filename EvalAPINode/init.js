var Course = require('./schemas/Course'),
	Teacher = require('./schemas/Teacher'),
	User = require('./schemas/User');

exports.init = function (req, res) {

	var courses = [
		[1,'Vefforritun II','Web Programming II','T-427-WEPO','2015-01-14','2015-04-04'],
		[2,'Forritunarmál','Programming languages','T-501-FMAL','2015-01-14','2015-04-04'],
		[3,'HR-Starfsnám','RU Internship','T-426-RUIS','2015-01-14','2015-04-04'],
		[4,'Stýrikerfi','Operating Systems','T-215-STY1','2015-01-14','2015-04-04'],
		[5,'Línuleg algebra','Linear algebra','T-211-LINA','2015-01-14','2015-04-04'],
		[6,'Kerfisstjórnun','System administration','T-239-KERF','2015-01-14','2015-04-04'],
		[7,'Gervigreind','Artificial Intelligence','T-622-ARTI','2015-01-14','2015-04-04']
	];

	for (var i = 0; i < courses.length; i++) {
		var course = courses[i];

		var c = new Course();
		c.NameIS = course[1];
		c.NameEN = course[2];
		c.CourseID = course[3];
		c.DateBegin = course[4];
		c.DateEnd = course[5];
		c.Teachers.push("5320aaf086d9572120dc9989");
		c.Teachers.push("5320aaf086d9572120dc9992");
		c.Teachers.push("5320aaf386d9572120dc99b3");

		c.save(function (err) {
			console.log(err)
		})
	}
	

	var students = [
[132,	'admin', 'Administrator', '1234567890', 'admin@example.com'],
[133,	'alexanders12', 'Alexander Baldvin Sigurðsson', '1611853109', 'alexanders12@ru.is'],
[134,	'andrii13', 'Andri Ívarsson', '2506883349', 'andrii13@ru.is'],
[135,	'antons10', 'Anton Marinó Stefánsson', '2004923239', 'antons10@ru.is'],
[136,	'arnarka13', 'Arnar Kári Ágústsson', '0203932899', 'arnarka13@ru.is'],
[137,	'arnara13', 'Arnar Dóri Ásgeirsson', '0608893339', 'arnara13@ru.is'],
[138,	'arnarb12', 'Arnar Freyr Bjarnason', '1611942049', 'arnarb12@ru.is'],
[139,	'arnari13', 'Arnar Gauti Ingason', '1205913209', 'arnari13@ru.is'],
[140,	'arnarj10', 'Arnar Jónasson', '1309764179', 'arnarj10@ru.is'],
[141,	'arona12', 'Aron Bachmann Árnason', '2106844339', 'arona12@ru.is'],
[142,	'aronh13', 'Aron Freyr Heiðarsson', '1404923969', 'aronh13@ru.is'],
[143,	'atlie13', 'Atli Freyr Einarsson', '0105923489', 'atlie13@ru.is'],
[144,	'atligud13', 'Atli Guðlaugsson', '1507922319', 'atligud13@ru.is'],
[145,	'a13', 'Atli Guðmundsson', '0110882609', 'a13@ru.is'],
[146,	'atlisg12', 'Atli Sævar Guðmundsson', '0301803489', 'atlisg12@ru.is'],
[147,	'auduro12', 'Auður Íris Ólafsdóttir', '2908922019', 'auduro12@ru.is'],
[148,	'arnia13', 'Árni Benedikt Árnason', '0804922789', 'arnia13@ru.is'],
[149,	'arnib13', 'Árni Björnsson', '2111852369', 'arnib13@ru.is'],
[150,	'arnit13', 'Árni Freyr Þorsteinsson', '0308912369', 'arnit13@ru.is'],
[151,	'asgeirt13', 'Ásgeir Daði Þórisson', '2810933209', 'asgeirt13@ru.is'],
[152,	'asrun13', 'Ásrún Sigurjónsdóttir', '1809873209', 'asrun13@ru.is'],
[153,	'benjamin13', 'Benjamín Björn Hinriksson', '1806923559', 'benjamin13@ru.is'],
[154,	'bergsteinn12', 'Bergsteinn Karlsson', '2508852539', 'bergsteinn12@ru.is'],
[155,	'bergthor13', 'Bergþór Þrastarson', '0504932969', 'bergthor13@ru.is'],
[156,	'bjarnil10', 'Bjarni Kristján Leifsson', '1712785899', 'bjarnil10@ru.is'],
[157,	'bjorgheidur12', 'Björgheiður Margrét Helgadóttir', '3012912649', 'bjorgheidur12@ru.is'],
[158,	'bjorgvin12', 'Björgvin Brynjarsson', '2011892929', 'bjorgvin12@ru.is'],
[159,	'bjornh13', 'Björn Halldór Helgason', '1603843879', 'bjornh13@ru.is'],
[160,	'carl13', 'Carl Andreas Sveinsson', '2110872939', 'carl13@ru.is'],
[161,	'dagur13', 'Dagur Arinbjörn Daníelsson', '1002922629', 'dagur13@ru.is'],
[162,	'dagurj13', 'Dagur Jónasson', '2905932639', 'dagurj13@ru.is'],
[163,	'daniela12', 'Daníel Agnarsson', '2912912369', 'daniela12@ru.is'],
[164,	'danielb13', 'Daníel Benediktsson', '1006922879', 'danielb13@ru.is'],
[165,	'd12', 'Daníel Jóhannsson', '0206922439', 'd12@ru.is'],
[166,	'darrir13', 'Darri Ragnarsson', '0203902719', 'darrir13@ru.is'],
[167,	'dovydas13', 'Dovydas Stankevicius', '1006944179', 'dovydas13@ru.is'],
[168,	'egillos11', 'Egill Örn Sigurðsson', '1412843129', 'egillos11@ru.is'],
[169,	'egills13', 'Egill Sveinbjörnsson', '0612913189', 'egills13@ru.is'],
[170,	'einarke12', 'Einar Karl Einarsson', '0105903619', 'einarke12@ru.is'],
[171,	'einarh13', 'Einar Logi Hreinsson', '0207892209', 'einarh13@ru.is'],
[172,	'eirikurbe10', 'Eiríkur Björn Einarsson', '0605813559', 'eirikurbe10@ru.is'],
[173,	'freyr12', 'Freyr Friðfinnsson', '1305923099', 'freyr12@ru.is'],
[174,	'freyrg12', 'Freyr Guðnason', '2301912209', 'freyrg12@ru.is'],
[175,	'frosti12', 'Frosti Bjarnason', '1106842319', 'frosti12@ru.is'],
[176,	'gisli13', 'Gísli Rafn Guðmundsson', '1602892369', 'gisli13@ru.is'],
[177,	'grettir10', 'Grettir Ólafsson', '1001892249', 'grettir10@ru.is'],
[178,	'grimurd09', 'Grímur Daníelsson', '1607892559', 'grimurd09@ru.is'],
[179,	'grimur13', 'Grímur Kristinsson', '0712913089', 'grimur13@ru.is'],
[180,	'gudjonj13', 'Guðjón Geir Jónsson', '0903912089', 'gudjonj13@ru.is'],
[181,	'gudjon12', 'Guðjón Pétursson', '0508813269', 'gudjon12@ru.is'],
[182,	'gudjon02', 'Guðjón Hólm Sigurðsson', '1108714579', 'gudjon02@ru.is'],
[183,	'gudmundura13', 'Guðmundur Auðunsson', '2012882589', 'gudmundura13@ru.is'],
[184,	'gudnig10', 'Guðni Garðarsson', '1412872309', 'gudnig10@ru.is'],
[185,	'gunnara12', 'Gunnar Egill Ágústsson', '0109923119', 'gunnara12@ru.is'],
[186,	'gunnarpg13', 'Gunnar Páll Gunnarsson', '1705882829', 'gunnarpg13@ru.is'],
[187,	'gunnargyl09', 'Gunnar Gylfason', '0309892019', 'gunnargyl09@ru.is'],
[188,	'gunnarmar13', 'Gunnar Marteinsson', '2609835209', 'gunnarmar13@ru.is'],
[189,	'gunnarkp13', 'Gunnar Karl Pálmason', '1703835089', 'gunnarkp13@ru.is'],
[190,	'gunnhildurf13', 'Gunnhildur Finnsdóttir', '1906773039', 'gunnhildurf13@ru.is'],
[191,	'hafthorg13', 'Hafþór Gunnlaugsson', '2410872989', 'hafthorg13@ru.is'],
[192,	'hafthort12', 'Hafþór Snær Þórsson', '2204922819', 'hafthort12@ru.is'],
[193,	'hallgrimurt13', 'Hallgrímur Þórhallsson', '2410933289', 'hallgrimurt13@ru.is'],
[194,	'haraldurk13', 'Haraldur Skjóldal Kristjánsson', '2008823779', 'haraldurk13@ru.is'],
[195,	'heidar13', 'Heiðar Freyr Steinunnarson', '1903803279', 'heidar13@ru.is'],
[196,	'heimiroj02', 'Heimir Örn Jóhannesson', '1907813489', 'heimiroj02@ru.is'],
[197,	'hinrik11', 'Hinrik Már Hreinsson', '0601893319', 'hinrik11@ru.is'],
[198,	'hjaltil13', 'Hjalti Leifsson', '1209912809', 'hjaltil13@ru.is'],
[199,	'hlynurh13', 'Hlynur Halldórsson', '1104923169', 'hlynurh13@ru.is'],
[200,	'holmfridur13', 'Hólmfríður Guðlaug Einarsdóttir', '0104932859', 'holmfridur13@ru.is'],
[201,	'hrafnkell13', 'Hrafnkell Baldursson', '3012932249', 'hrafnkell13@ru.is'],
[202,	'hreinnr13', 'Hreinn Rúnarsson', '2608923049', 'hreinnr13@ru.is'],
[203,	'hugrun13', 'Hugrún Ósk Bjarnadóttir', '2608765979', 'hugrun13@ru.is'],
[204,	'hogni10', 'Högni Rúnar Ingimarsson', '2905902569', 'hogni10@ru.is'],
[205,	'hordur12', 'Hörður Ragnarsson', '0504922499', 'hordur12@ru.is'],
[206,	'ingolfurs12', 'Ingólfur Daníel Sigurðsson', '1302912609', 'ingolfurs12@ru.is'],
[207,	'jakob12', 'Jakob Frímann Kristinsson', '1408903679', 'jakob12@ru.is'],
[208,	'johannb13', 'Jóhann Berentsson', '0501882489', 'johannb13@ru.is'],
[209,	'johannob01', 'Jóhann Örn Bjarkason', '0812815059', 'johannob01@ru.is'],
[210,	'johannl12', 'Jóhann Hrafnkell Líndal', '3011852519', 'johannl12@ru.is'],
[211,	'johannai13', 'Jóhanna Dóra Ingólfsdóttir', '2109922359', 'johannai13@ru.is'],
[212,	'jonaj11', 'Jón Atli Jónsson', '2907913839', 'jonaj11@ru.is'],
[213,	'jonj13', 'Jón Freysteinn Jónsson', '0301952999', 'jonj13@ru.is'],
[214,	'jonk10', 'Jón Helgi Kjartansson', '1204903549', 'jonk10@ru.is'],
[215,	'jonms13', 'Jón Mogensson Schow', '0609775779', 'jonms13@ru.is'],
[216,	'jons13', 'Jón Agnar Stefánsson', '0805932449', 'jons13@ru.is'],
[217,	'jokulle11', 'Jökull I Elísabetarson', '2604843119', 'jokulle11@ru.is'],
[218,	'jorundur13', 'Jörundur Jörundsson', '3112922699', 'jorundur13@ru.is'],
[219,	'karitas13', 'Karítas Ólafsdóttir', '2306922549', 'karitas13@ru.is'],
[220,	'karl12', 'Karl Einarsson', '2610912599', 'karl12@ru.is'],
[221,	'kristinnj13', 'Kristinn Júlíusson', '1508932409', 'kristinnj13@ru.is'],
[222,	'kristinh12', 'Kristín Laufey Hjaltadóttir', '1410912129', 'kristinh12@ru.is'],
[223,	'kristjane09', 'Kristján Ingi Einarsson', '2106872389', 'kristjane09@ru.is'],
[224,	'kristjanhar12', 'Kristján Harðarson', '3101922369', 'kristjanhar12@ru.is'],
[225,	'kristjanj11', 'Kristján Þór Jónsson', '1102912999', 'kristjanj11@ru.is'],
[226,	'kristjanola13', 'Kristján Ólafur Ólafsson', '1507882779', 'kristjanola13@ru.is'],
[227,	'kristjant13', 'Kristján Patrekur Þorsteinsson', '2104933449', 'kristjant13@ru.is'],
[228,	'matthiassig12', 'Matthías Sigurðsson', '0910912599', 'matthiassig12@ru.is'],
[229,	'matthiasss13', 'Matthías Skjöldur Sigurðsson', '2407902549', 'matthiasss13@ru.is'],
[230,	'natan12', 'Natan Örn Ólafsson', '2205923089', 'natan12@ru.is'],
[231,	'olafurij12', 'Ólafur Ívar Jónsson', '2504754629', 'olafurij12@ru.is'],
[232,	'omar13', 'Ómar Óskarsson', '0306932489', 'omar13@ru.is'],
[233,	'perla11', 'Perla Þrastardóttir', '0911773319', 'perla11@ru.is'],
[234,	'petrap12', 'Petra Pétursdóttir', '1003893399', 'petrap12@ru.is'],
[235,	'peturh13', 'Pétur Bergmann Halldórsson', '0509902499', 'peturh13@ru.is'],
[236,	'ragnara13', 'Ragnar Adolf Árnason', '1106883429', 'ragnara13@ru.is'],
[237,	'ragnarr13', 'Ragnar Borgþór Ragnarsson', '0104922119', 'ragnarr13@ru.is'],
[238,	'randver10', 'Randver Pálmi Gyðuson', '1609852759', 'randver10@ru.is'],
[239,	'rannveigg13', 'Rannveig Guðmundsdóttir', '1212882659', 'rannveigg13@ru.is'],
[240,	'rikard13', 'Rikard Arnar B. Birgisson', '2001884039', 'rikard13@ru.is'],
[241,	'saraa12', 'Sara Árnadóttir', '1104922279', 'saraa12@ru.is'],
[242,	'sigtrygguro13', 'Sigtryggur Ómarssson', '2609892009', 'sigtrygguro13@ru.is'],
[243,	'sigurdura13', 'Sigurður Már Atlason', '2011922189', 'sigurdura13@ru.is'],
[244,	'sigurdurh11', 'Sigurður Rúnar Helgason', '0411853179', 'sigurdurh11@ru.is'],
[245,	'sigurdurt11', 'Sigurður Aðalsteinn Þorgeirsson', '1502825279', 'sigurdurt11@ru.is'],
[246,	'snorrib12', 'Snorri Birgisson', '2710912739', 'snorrib12@ru.is'],
[247,	'snaebjorn13', 'Snæbjörn Þórir Eyjólfsson', '0102932359', 'snaebjorn13@ru.is'],
[248,	'snaevar13', 'Snævar Dagur Pétursson', '0402922259', 'snaevar13@ru.is'],
[249,	'sonja13', 'Sonja Jónsdóttir', '1802923499', 'sonja13@ru.is'],
[250,	'stefand12', 'Stefán Ingi Daníelsson', '0407837179', 'stefand12@ru.is'],
[251,	'stefane12', 'Stefán Arnar Einarsson', '2701903249', 'stefane12@ru.is'],
[252,	'stefanh13', 'Stefán Hafsteinsson', '1701933189', 'stefanh13@ru.is'],
[253,	'steinara13', 'Steinar Þór Árnason', '2404932259', 'steinara13@ru.is'],
[254,	'steinar13', 'Steinar Ágúst Steinarsson', '0804922869', 'steinar13@ru.is'],
[255,	'steinunnf13', 'Steinunn Marta Friðriksdóttir', '0501902699', 'steinunnf13@ru.is'],
[256,	'svava13', 'Svava Dögg Björgvinsdóttir', '2006942799', 'svava13@ru.is'],
[257,	'sveinndb11', 'Sveinn Dal Björnsson', '0704842189', 'sveinndb11@ru.is'],
[258,	'sveas', 'Sveinn Arnar Stefánsson', '2504794769', 'sveas@ru.is'],
[259,	'solvih13', 'Sölvi Hjaltason', '2508922179', 'solvih13@ru.is'],
[260,	'telma13', 'Telma Guðbjörg Eyþórsdóttir', '1204922099', 'telma13@ru.is'],
[261,	'valgerdur13', 'Valgerður Rós Morthens', '2212922519', 'valgerdur13@ru.is'],
[262,	'vidart02', 'Viðar Þorgeirsson', '1007763599', 'vidart02@ru.is'],
[263,	'vignir13', 'Vignir Karl Gylfason', '0501882999', 'vignir13@ru.is'],
[264,	'thorvardur13', 'Þorvarður Bergmann Kjartansson', '0203922749', 'thorvardur13@ru.is'],
[265,	'thordisj12', 'Þórdís Jóna Jónsdóttir', '2802922309', 'thordisj12@ru.is'],
[266,	'aegir13', 'Ægir Már Jónsson', '0507922699', 'aegir13@ru.is'],
[267,	'ornbja05', 'Örn Bjarnason', '1203852329', 'ornbja05@ru.is'],
[268,	'baering10', 'Bæring Gunnar Steinþórsson', '1001902499', 'baering10@ru.is'],
[269,	'haukurht05', 'Haukur Hafsteinn Þórsson', '1908804439', 'haukurht05@ru.is'],
[270,	'thorgeiro05', 'Þorgeir Ómarsson', '2107804679', 'thorgeiro05@ru.is'],
[271,	'dabs', 'Daníel Brandur Sigurgeirsson', '1203735289', 'dabs@ru.is'],
[272,	'dariodm', 'Dario Della Monica', '0000000035', 'dariodm@ru.is'],
[273,	'hjaltim', 'Hjalti Magnússon', '0212862149', 'hjaltim@ru.is'],
[274,	'thorgeirk', 'Þorgeir Auðunn Karlsson', '3004922079', 'thorgeirk11@ru.is'],
[275,	'adalheidurh', 'Aðalheiður Hreinsdóttir', '1603903799', 'adalheidurh10@ru.is'],
[276,	'aria', 'Ari Freyr Ásgeirsson', '0607902489', 'aria12@ru.is'],
[277,	'benedikt', 'Benedikt Sigurleifsson', '1808922499', 'benedikt12@ru.is'],
[278,	'freysteinn', 'Freysteinn Alfreðsson', '1807825919', 'freysteinn@ru.is'],
[279,	'egill', 'Egill Sigurðarson', '0807923369', 'egill13@ru.is'],
[280,	'hinrik', 'Hinrik Már Hreinsson', '0601893319', 'hinrik11@ru.is'],
[281,	'kristinnt', 'Kristinn Björgvin Árdal', '0811902169', 'kristinnt13@ru.is'],
[282,	'ragnart', 'Ragnar Páll Árdal', '1205892379', 'ragnart11@ru.is'],
[283,	'sigurdurh', 'Sigurður Rúnar Helgason', '0411853179', 'sigurdurh11@ru.is'],
[284,	'tomasm', 'Tómas Ken Magnússon', '0206924489', 'tomasm12@ru.is'],
[285,	'stephans', 'Stephan Schiffel', '1509803489', 'stephans@ru.is'],
[286,	'sigurrosk', 'Sigurrós Soffía Kristinsdóttir', '1108793189', 'sigurrosk07@ru.is']
	];

	for (var i = 0; i < students.length; i++) {
		var student = students[i];

		if(isNaN(parseInt(student[1].substring(student[1].length - 2, student[1].length)))) {
			var teacher = new Teacher();
			console.log('came here' + student)
			teacher.Username = student[1];
			teacher.Fullname = student[2];
			teacher.SSN = student[3];
			teacher.Email = student[4];
			teacher.Role = 'teacher';
			teacher.ImageURL = 'http://www.ru.is/kennarar/dabs/img/' + student[3].substring(0,2) + '/' + student[3] + '.jpg';
			teacher.save(function (err) {
				if (err) {
					return res.send(err)
				}
			})
		}

		var s = new User();
		
		s.Username = student[1];
		s.Fullname = student[2];
		s.Password = s.generateHash(123456);
		s.SSN = student[3];
		s.Email = student[4];
		s.Role = (student[1] !== 'admin') ? 'student' : 'admin';
		s.save(function (err) {
			if (err) {
				return res.send(err);
			}
		})

	}
	res.send(200, 'Successfully populated database with bunch of stuff');
};
