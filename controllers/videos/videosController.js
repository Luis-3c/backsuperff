const axios = require('axios');
const props = require('../../config/properties');
const db = require('../../config/db');
const moment = require('moment');



const VIMEOAPI = props.VIMEO_API;
const OPTIONS = {
	headers: {
		Authorization: 'bearer 432e9acbd0057f0c1af34abb59acda88',
		Accept: 'application/vnd.vimeo.*+json;version=3.4'
	}
};

exports.getvideos =  (req, res) => { // obtener los videos a mostrar en el index de videos
    const videos = [
        {
            id: Number,
            idvideo: Number,
            title: String,
            description: String,
            idcategory: Number,
            thumbnail: String,
            timeago: String,
            created_at: String,
            updated_at: String
        }
    ];    
	db.query('select * from videos order by created_at desc limit 4', async(err, result) => {
        if (err) return res.status(500).send('Server error');
        for(var i=0; i<result.length; i++){
            videos[i] = result[i];
            videos[i].timeago = moment(videos[i].created_at).fromNow();
            await getThumbnail(videos[i])
                .then((thumbnail)=>{
                    videos[i].thumbnail = thumbnail;
                });
        }
        res.json({videos});
	});
};

function getThumbnail(video){ // obtener la miniatura del video
    return axios.get(VIMEOAPI + video.idvideo, OPTIONS)
				.then((response) => {
                    return response.data.pictures.sizes[3].link;
                    
				})
				.catch((error) => {
					return error;
                });
}

exports.getvideo = (req,res) => { // obtener el video a reproducir
    const videos = [
        {
            id: Number,
            idvideo: Number,
            title: String,
            description: String,
            idcategory: Number,
            thumbnail: String,
            timeago: String,
            created_at: String,
            updated_at: String
        }
    ];
    db.query("select * from videos where id = ?",[req.params.id], (err, result) => {
        videos[0] = result[0];
        videos[0].created_at = moment(result[0].created_at).format('LL');
        res.json({videos});
    });
}

exports.loadmorevideosindex = (req, res) => { // carga mas videos en el index
    const videos = [
        {
            id: Number,
            idvideo: Number,
            title: String,
            description: String,
            idcategory: Number,
            thumbnail: String,
            timeago: String,
            created_at: String,
            updated_at: String
        }
    ];
    db.query('select * from videos where id < ? order by created_at desc limit 4', [req.params.id], async(err, result) => {
        if(err) return res.status(500).send({response: "Server error"});
        if(result[0]){
            for(var i=0; i<result.length; i++){
                videos[i] = result[i];
                videos[i].timeago = moment(videos[i].created_at).fromNow();
                await getThumbnail(videos[i])
                    .then((thumbnail)=>{
                        videos[i].thumbnail = thumbnail;
                    });
            }
            res.json({videos});
        }else {
            res.json({'videos' : []});
        }
    });
}

exports.getvideosrecommend = (req,res) => { //vidoes sugeridos(aleatorios)
    const videos = [
        {
            id: Number,
            idvideo: Number,
            title: String,
            description: String,
            idcategory: Number,
            thumbnail: String,
            timeago: String,
            created_at: String,
            updated_at: String
        }
    ];
    db.query('select * from videos order by rand() limit 4', async(err, result)=>{
       if(err) return res.status(500).send({response: 'Server error'});
       if(result[0]){
           for(var i=0; i<result.length; i++){
               videos[i] = result[i];
               videos[i].timeago = moment(videos[i].created_at).fromNow();
               await getThumbnail(videos[i])
                .then((thumbnail)=>{
                    videos[i].thumbnail = thumbnail;
                });
           }
           res.json({videos});
       } else {
           res.json({'videos' : []});
       }
    });
}

exports.searcherresults = (req,res) => { //buscador del videos index
    const videos = [
        {
            id: Number,
            idvideo: Number,
            title: String,
            description: String,
            idcategory: Number,
            thumbnail: String,
            timeago: String,
            created_at: String,
            updated_at: String
        }
    ];
    
    db.query('select * from videos where title like concat("%",?,"%") or description like concat("%",?,"%")', [req.body.input, req.body.input], async(err,result)=>{
        if(err) return res.status(500).send({response: 'Server error'});
        if(result[0]){
            for(var i=0; i<result.length; i++){
            videos[i] = result[i];
            videos[i].timeago = moment(videos[i].created_at).fromNow();
            await getThumbnail(videos[i])
             .then((thumbnail)=>{
                 videos[i].thumbnail = thumbnail;
             });
        }
        res.json({videos});
        }else{
            res.json({'videos' : ""});
        }
        
        
    });
}