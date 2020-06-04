const stripe = require('stripe')('sk_test_ADvZLFzBuNx79paMu2VqomWf00olXr3TFO');
const db = require('../../config/db');

/* exports.subscriptionForm = (req, res)=>{
    db.query('select first_name, last_name, email where iduser = ' + req.iduser, (err, user) => {
        if(err) return res.status(500).sebd({response: "Server error"});
        res.json({
            first_name: user[0].first_name,
            email: user[0].email,
        })
    })
}
 */
exports.subscribe = (req,res)=>{ //suscribir al usuario
    stripe.customers.create({
        email: req.body.email,
        source: req.body.token.id
    }, (error, customer)=>{
        if(error) return res.send({response: 'Error creating customer'});
        const { id } = customer;
        stripe.subscriptions.create({
            customer: id,
            items:[
                {
                    plan: "plan_HDkGAysg3H46Fs",
                },
            ],
        }, (error, subscription) => {
            if(error) return res.send({response: 'Error creating subscription'});
            db.query('insert into customers values (?, ?, ?, ?, ?, ?)',
                    [`${id}`, req.iduser, `${subscription.plan.id}`, `${subscription.id}`, null, null],
                    (error, result) => {
                        if(error) return res.status(500).send({response: 'Server error'});
                        res.json({response: 'Everithing ok. You are now subscribed.'});
                    });

        });

    });

   
}

exports.validarSub = (req,res) => { //saber si está suscrito o no
    db.query('select id from customers where iduser = ?',[req.iduser], (err, customer)=>{
        if(err) return res.status(500).send({response: 'Server error'});
        if(!customer[0]){
            console.log("no es cliente");
            res.json({response: 'continue'});
        }else{
            stripe.subscriptions.list( //buscar el estatus de la suscripción
                {customer: customer[0].id},
                (error, subscriptions) => {
                    const { status } = subscriptions.data[0];
                    console.log(status);
                    if(status == "active"){
                        /* console.log('es cliente y esta activo'); */
                        res.json({response: 'stop'});
                    }else{
                        /* console.log('es cliente pero no está activo'); */
                        res.json({response: 'continue'}); 
                    }
                }
            )
        }
    });
}

// This is a secure and encrypted payment. We never store your credit card information.