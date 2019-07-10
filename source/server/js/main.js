let current_section_id = "";
let current_note_id = "";
let note_history_dict = {};


//显示 section menu 和 笔记显示区
function show_current_note_page(section_id, note_id) {
    let section_menu_area = document.getElementById("section-menu");
    let section_menu_path_relative = "/source/section-menu.blade.html";
    get_local_file(section_menu_path_relative, section_menu_area, section_id, note_id);
}

//显示笔记
function read_note_text(section_id, note_id) {
    let show_note_area = document.getElementById("show-note-area");
    let note_path_relative = "/" + note_menu_dict[section_id][note_id]["HTML_FILE_REL"] + ".blade.html";
    get_local_file(note_path_relative, show_note_area, section_id, note_id);
}

function get_note_menu(section_id, note_id = -1) {
    if (current_section_id === parseInt(section_id)){
        return
    }
    let note_menu = document.getElementById("note-menu");
    // 删除 note_menu 原先所有显示note_list
    while (note_menu.firstChild) {
        note_menu.removeChild(note_menu.firstChild)
    }
    // 获取现在 section 所有笔记情况
    let section_files_info = note_menu_dict[section_id];
    // 如果 没有note 直接 显示没有笔记 并返回
    if (Object.keys(section_files_info).length === 0){
        let section_name = document.getElementById("section-span-" + section_id).innerText.trim();
        let show_note_area = document.getElementById("show-note-area");
        show_note_area.innerHTML = "<h1>" + section_name + " section is empty" + "</h1>"
        return
    }
    for (let file_id in section_files_info) {
        let note_span = document.createElement('span');
        if (section_files_info.hasOwnProperty(file_id)){
            note_span.innerText = section_files_info[file_id]["NOTE_FILE_NAME"];
            note_span.setAttribute("onclick", "get_note('" + section_id + "','" + file_id + "');");
            note_menu.appendChild(note_span)
            note_span.setAttribute("id", section_id + "-" + file_id);
        }
    }


    if(note_id == -1){
        //如果历史上 曾点过词section，获取最后一次访问的 note-id 标记为 active 并且显示对应的 note 内容
        if (!note_history_dict.hasOwnProperty(section_id)){
            note_history_dict[section_id] = Object.keys(note_menu_dict[section_id])[0];
        }
        note_id = note_history_dict[section_id];
    }

    // read_note_text(section_id, note_id);
    if (current_section_id != ""){
        document.getElementById("section-span-" + current_section_id).classList.remove("active");
    }
    // document.getElementById(section_id + "-" + note_id).classList.add("active");
    current_section_id = section_id;
    current_note_id = note_id;
    document.getElementById("section-span-" + section_id).classList.add("active");
    get_note(section_id, note_id)
}

function get_note(section_id, note_id) {
    read_note_text(section_id, note_id);
    window.history.pushState("", 'Title', "/" + note_menu_dict[section_id][note_id]["HTML_FILE_REL"]);
    // Remove active class note span in note menu
    // 去除现在note menu所有 active 的 class 的 note
    let note_menu = document.getElementById("note-menu");
    document.getElementById(current_section_id + "-" + current_note_id).classList.remove("active")
    document.getElementById(section_id + "-" + note_id).classList.add("active")
    current_section_id = section_id
    current_note_id = note_id
    note_history_dict[current_section_id] = current_note_id
}

function get_local_file(file_location, change_tag, section_id, note_id) {
    let target_file = new XMLHttpRequest();
    target_file.onreadystatechange = function () {
        if (target_file.readyState === 4) {
            if (target_file.status === 200 || target_file.status === 0) {
                change_tag.innerHTML = target_file.responseText;
                if (file_location === "/source/section-menu.blade.html"){
                    get_note_menu(section_id, note_id);
                    expand_note_menu(section_id)
                }

            }
        }
    };
    target_file.open("GET", file_location);
    target_file.send(null);
}

function expand_note_menu(section_id) {
    let current_section_span = document.getElementById("section-span-" + section_id).parentElement
    while(current_section_span.id != "section-menu"){
        current_section_span.classList.add("show")
        current_section_span = current_section_span.parentElement
    }

}

// -----------
let toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
};

let docGet = function(selector){
    return document.querySelector(selector);
};

let recurToggleClass = function(element,className){
    toggleClass(element,className);
    let child = element.childNodes;
    if (child.length != 0){
        child.forEach(e => {
            if(e.nodeName != "#text"){
                recurToggleClass(e,className)
            }
        });
    }
};

document.querySelector('.top-nav').addEventListener('click',function(){
    toggleClass(docGet('#note-menu'),'hide')
    toggleClass(docGet('#section-menu'),'hide')
    //设置为fixed形式
    toggleClass(docGet('#note-menu'),'section-menu-fixed')
    toggleClass(docGet('#section-menu'),'note-menu-fixed')
    //取消/添加所有col的class
    //col-
    toggleClass(docGet('#note-menu'),'col-5')
    toggleClass(docGet('#section-menu'),'col-5')
    toggleClass(docGet('#show-note-area'),'col-2')
    //col-sm
    toggleClass(docGet('#note-menu'),'col-sm-2')
    toggleClass(docGet('#section-menu'),'col-sm-2')
    toggleClass(docGet('#show-note-area'),'col-sm-8')
    //全屏显示
    toggleClass(docGet('#show-note-area'),'col-sm-12')
    toggleClass(docGet('#show-note-area'),'col-12')
});
