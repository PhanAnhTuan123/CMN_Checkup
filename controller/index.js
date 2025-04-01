const SubjectModel = require("../models/index.js");
const { uploadFile } = require("../service/file.service.js");
const validate = require("../utils/validate.js");
const Controller = {};

Controller.get = async (req, res) => {
    try {
      const subjects = await SubjectModel.getSubjects();
      return res.render("index", { subjects }); // truyền thông tin của các subject đã lấy vào file index.ejs
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting subjects");
    }
  };

  Controller.getOne = async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.getOneSubject(id);
      console.log(subject.image);
      if (subject) {
        return res.render("edit", { subject });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting subject");
    }
  };

  Controller.post = async (req, res) => {
    const errors = validate.validatePayload(req.body);
    if(errors) {
        res.send(errors.join(", "));
    }
    const { name, type, semester, faculty } = req.body; 
    const image = req.file;
    try {
        const imageUrl = await uploadFile(image);
        const subject = await SubjectModel.createSubject({
            name,
            type,
            semester,
            faculty,
            image: imageUrl,
        });

        console.log("Subject created", subject);
        res.redirect("/subjects"); // sau khi tạo mới subject thành công thì chuyển hướng về danh sách các subject
    } catch (error) {
        res.status(500).send("Error creating subject");
    };
  };

  Controller.put = async (req, res) => {
    console.log("Start put method")
    try {
      console.log("image: ", req.body.imageLookup)
      
      const { id } = req.params;
      // const errors = validateUpdate(req.body);
      const image = req?.file;
      let imageUrl;
      if(!image) {
        imageUrl = req.body.imageLookup;
      } else {
        imageUrl = await uploadFile(image);
      }
      // if(errors) {
      //   // res.send(errors.join(", "));
      // }
      const { name, type, semester, faculty } = req.body;
      
      const subject = await SubjectModel.updateSubject(id, { name, type, semester, faculty, image: imageUrl });
      if (subject) {
        console.log("Subject updated", subject);
        res.redirect("/subjects"); // sau khi cập nhật subject thành công thì chuyển hướng về trang danh sách các subject
     
      }
    } catch (error) {}
  };

  Controller.delete = async (req, res) => {
    try {
      const { id } = req.params;
      const existSubject = await SubjectModel.getOneSubject(id);
      const subject = await SubjectModel.deleteSubject(id, existSubject.name);
      if (subject) {
        console.log("Subject deleted", subject);
        res.redirect("/subjects");
      }
    } catch (error) {}
  }


module.exports = Controller;