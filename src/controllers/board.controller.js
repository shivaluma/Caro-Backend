const { ResponseService, BoardService } = require('../services');
const ListService = require('../services/ListService');

exports.postBoard = async (req, res) => {
  const { user } = req;
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Missing required field.'));
  }

  try {
    const board = await BoardService.createBoard(user._id, name, description);
    const wentWellList = ListService.createList(board._id, 'Went well');
    const toImProveList = ListService.createList(board._id, 'To Improve');
    const actionItemList = ListService.createList(board._id, 'Action Item');
    await Promise.allSettled([wentWellList, toImProveList, actionItemList]);
    return res
      .status(201)
      .json(ResponseService.response(201, 'Create board successfully.', board));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(ResponseService.error(500, 'Some unexpected error occurred.', err));
  }
};

exports.deleteBoard = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  req.log.error(id, user.id);
  try {
    await BoardService.removeBoard(user._id, id);

    return res
      .status(200)
      .json(ResponseService.response(200, 'Remove board successfully.'));
  } catch (err) {
    return res
      .status(400)
      .json(ResponseService.error(400, 'Bad Request.', err));
  }
};

exports.putBoard = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const board = await BoardService.updateBoard(user._id, id, {
      name,
      description,
    });

    return res
      .status(200)
      .json(ResponseService.response(200, 'Update board successfully.', board));
  } catch (err) {
    req.log.error(err);
    return res
      .status(400)
      .json(ResponseService.error(400, 'Bad Request.', null));
  }
};

exports.getBoards = async (req, res) => {
  const { user } = req;
  try {
    const boards = await BoardService.getBoards(user._id);
    req.log.error(boards);
    return res.status(200).json(ResponseService.response(200, null, boards));
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Unexpected Error', err));
  }
};

exports.getBoard = async (req, res) => {
  const { idBoard } = req.params;

  try {
    const board = await BoardService.getBoard(idBoard);
    return res.status(200).json(ResponseService.response(200, null, board));
  } catch (err) {
    return res
      .status(500)
      .json(ResponseService.error(500, 'Unexpected Error', err));
  }
};
