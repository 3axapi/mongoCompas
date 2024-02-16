function isValidDocument(doc) {
    return doc && typeof(doc) === "object" && Object.keys(doc).length > 0;
}

function errorHandle(res, err) {
    console.error(err);
    res.status(500).json({error: err.message});
}

function validateId(id) {
    return !isNaN(id);
}

function validateIdInRequest(req, res, next) {
    const idPonczka = +req.params.id;
    if (validateId(idPonczka))
        return res.status(400).json({message: "Invalid ID format"})

    req.correctID = idPonczka;
    next();
}



module.exports = {
    isValidDocument,
    errorHandle,
    validateId,
    validateIdInRequest 
}